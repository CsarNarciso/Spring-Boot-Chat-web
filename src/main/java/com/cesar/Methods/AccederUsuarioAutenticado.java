package com.cesar.Methods;

import java.security.Principal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

public class AccederUsuarioAutenticado {
	
	public AccederUsuarioAutenticado(Usuario_Repositorio userRepo) {
		
		this.userRepo = userRepo;
	}
	
	
	public Usuario getDatos() {

		Authentication a = SecurityContextHolder.getContext().getAuthentication();
		
		return userRepo.buscarPorNombre_Email(a.getPrincipal().toString());
	}
	
	
	private Usuario_Repositorio userRepo;
}
