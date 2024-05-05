package com.shop.back.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil implements Serializable {


    private static final long serialVersionUID = -2550185165626007488L;

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.accessExpirationMs}")
    private int accessExpirationMs;

    @Value("${jwt.refreshExpirationMs}")
    private int refreshExpirationMs;


    public void setSecret(String secret) {
        this.secret = secret;
    }

    //retrieve username from jwt token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }


    //retrieve expiration date from jwt token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

//    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = getAllClaimsFromToken(token);
//        return claimsResolver.apply(claims);
//    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims != null ? claimsResolver.apply(claims) : null;
    }

    //for retrieveing any information from token we will need the secret key
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    //check if the token has expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    //generate token for user
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        String username = userDetails.getUsername();
        
        //권한 정보 추가
        claims.put("authorities", userDetails.getAuthorities());

        String token = doGenerateToken(claims, username, secret);

        // 토큰 생성 로그 추가
        logger.info("JWT Token generated for user: {}", username);

        // 콘솔에 토큰 출력
        System.out.println("Generated JWT Token for user " + username + ": " + token);

        return token;
    }

    //while creating the token -
    //1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    //2. Sign the JWT using the HS512 algorithm and secret key.
    //3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string
    private String doGenerateToken(Map<String, Object> claims, String subject, String secret) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    //validate token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    //access token
    public String generateAccessToken(UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessExpirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    //refresh token
    public String generateRefreshToken(UserDetails userDetails, HttpServletResponse response) {
        String refreshToken = Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();

        // refreshToken을 쿠키에 저장
        createCookie(response, "refreshToken", refreshToken, refreshExpirationMs / 1000, true, true, "/");

        return refreshToken;
    }

    private void createCookie(HttpServletResponse response, String name, String value, int maxAge, boolean httpOnly, boolean secure, String path) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(maxAge);
        cookie.setHttpOnly(httpOnly);
        cookie.setSecure(secure);
        cookie.setPath(path);
        response.addCookie(cookie);
    }

    // 쿠키에서 refreshToken을 가져옴
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void expireCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(refreshToken, null);
        cookie.setMaxAge(0); // 만료 시간을 0으로 설정하여 즉시 만료
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}
