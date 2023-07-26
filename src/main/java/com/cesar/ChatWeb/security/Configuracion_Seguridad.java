package com.cesar.ChatWeb.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.cesar.ChatWeb.service.Usuario_UserDetailsService;

@Configuration
@EnableWebSecurity
public class Configuracion_Seguridad{


	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
		.csrf()
			.disable()
		.authorizeHttpRequests()
			.requestMatchers("/registro/**").permitAll()
			.requestMatchers("/ImagenesGenerales/**").permitAll()
			.requestMatchers("/ImagenesDePerfil/**").permitAll()
			.anyRequest()
			.authenticated()
		.and()
			.formLogin()
			.loginPage("/login")
			.loginProcessingUrl("/login/validar")
			.defaultSuccessUrl("/chat", false)
			.usernameParameter("usernameOrEmail")
			.permitAll()
		.and()
			.logout()
			.logoutUrl("/logout")
			.logoutSuccessUrl("/login")
			.invalidateHttpSession(true)
			.deleteCookies("JSESSIONID")
			.permitAll();

		return http.build();

	}



	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
	         throws Exception {
	    return authenticationConfiguration.getAuthenticationManager();
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

