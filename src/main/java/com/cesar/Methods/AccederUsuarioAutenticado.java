package com.cesar.Methods;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.service.CustomUserDetails;

public class AccederUsuarioAutenticado {

	
	public static Usuario getIdAndNombre(Principal p) {
		
		CustomUserDetails c = null;
		
		
		if ( p instanceof Authentication ) {
			
			Authentication a = (Authentication) p;
			
			if ( a.getPrincipal() instanceof  CustomUserDetails ) {
				
				c = (CustomUserDetails) a;
				
			}
			
		}
		
		return new Usuario(c.getId(), c.getUsername());
		
	}
	
	
	
	
}
