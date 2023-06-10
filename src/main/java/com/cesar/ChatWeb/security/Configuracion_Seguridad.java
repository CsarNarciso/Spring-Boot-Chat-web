package com.cesar.ChatWeb.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import com.cesar.ChatWeb.service.Usuario_UserDetailsService;

@Configuration
@EnableWebSecurity
public class Configuracion_Seguridad{
	
	
	@Bean
	public SecurityContextRepository securityContextRepository() {
		return new DelegatingSecurityContextRepository(
				new RequestAttributeSecurityContextRepository(),
				new HttpSessionSecurityContextRepository()
			);
	}

	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http
		.csrf()
			.disable()
		.authorizeHttpRequests()
			.requestMatchers("/login/formularioRegistro/**").permitAll()
			.requestMatchers("/chat/**").permitAll()
			.requestMatchers("/app/**").permitAll()
			.requestMatchers("/user/**").permitAll()
			.requestMatchers("/queue/**").permitAll()
			.anyRequest()
			.authenticated()
		.and()
			.formLogin()
			.loginPage("/login")
			.loginProcessingUrl("/verificacionLogin")
			.defaultSuccessUrl("/index", true)
			.usernameParameter("usernameOrEmail")
			.permitAll()
		.and()
			.logout()
			.logoutUrl("/logout")
			.logoutSuccessUrl("/login")
			.invalidateHttpSession(true)
			.deleteCookies("JSESSIONID")
			.permitAll()
		.and()
			.securityContext()
			.securityContextRepository(securityContextRepository());
		
		return http.build();
		
	}
	
	@Bean
	public UserDetailsService userDetailsService() {
		return new Usuario_UserDetailsService();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
	
	