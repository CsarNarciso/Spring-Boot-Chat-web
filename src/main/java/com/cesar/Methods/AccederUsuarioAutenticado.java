package com.cesar.Methods;

import java.io.File;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;

import com.cesar.ChatWeb.service.CustomUserDetails;

public class AccederUsuarioAutenticado {

	
	public static CustomUserDetails getDatos(Principal p) {
		
		CustomUserDetails c = null;
		
		if ( p instanceof Authentication ) {
			
			Authentication a = (Authentication) p;
			
			if ( a.getPrincipal() instanceof  CustomUserDetails ) {
				
				c = (CustomUserDetails) a;
			}
		}
		
		return c;
	}
	
	
	
}
