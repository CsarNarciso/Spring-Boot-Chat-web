package com.cesar.ChatWeb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

public class Usuario_UserDetailsService implements UserDetailsService {

	@Autowired
	private Usuario_Repositorio repositorio_usuario;

	@Override
	public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {

		Usuario usuario = repositorio_usuario.buscarPorNombre_Email(usernameOrEmail);

		if( usuario == null) {
			throw new UsernameNotFoundException("--Usuario no encontrado--");
		}
		else {
			System.out.println("Usuario " + usuario.getNombre() + " encontrado en la base de datos");
		}

		return User.builder()
				.username(usuario.getNombre())
	            .password(usuario.getContraseña())
	            .roles("USER")
	            .build();

	}


}
