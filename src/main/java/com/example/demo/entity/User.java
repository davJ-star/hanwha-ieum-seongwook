package com.example.demo.entity;

import com.example.demo.Enum.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@Entity
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", updatable = false)
    private Long id;

    @Column(name="email", nullable = false, unique=true)
    private String email;

    @Column(name="password" , nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "profile_image")
    private String profileImage;

    @Builder
    public User(String email, String password, String auth, String name, String profileImage) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.profileImage = profileImage;
    }

    public void update(String name) {
        this.name = name;
    }

    // 비밀번호 변경 메소드
    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    // 프로필 이미지 업데이트 메소드
    public void updateProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
    //권한 반환

    //사용자의 id 반환 (고유값)
    @Override
    public String getUsername() {
        return email;
    }

    //사용자의 패스워드 반환
    @Override
    public String getPassword() {
        return password;
    }

    //계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        return true; // true -> 만료되지 않았음
    }

    //계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return true; //true -> 잠금되지 않았음
    }

    //패스워드의 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        return true; //true -> 만료되지 않았음
    }

    //계정 사용 가능 여부 반환
    @Override
    public boolean isEnabled() {
        return true; //true -> 사용 가능
    }


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // 기본값은 USER


    @Builder
    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.role = Role.USER;  // 기본 사용자 권한
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }


}