 package com.cesar.ChatWeb.controller;

import java.security.Principal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.Methods.AccederUsuarioAutenticado;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Controller
public class Controlador_Paginas {



	@RequestMapping("/login")
	public String dameLogin() {
        return "Login";
	}
	


	@RequestMapping("/login/formularioRegistro")
	public String damePagina_Registro(Model modelo){

		modelo.addAttribute("usuario", new Usuario());

		return "Pagina_Registro";
	}
	
	
	
	
	
	@RequestMapping("/index")
	public String dameIndex_desdeLogin(Principal p, Model modelo){
		
		modelo.addAttribute("UsuarioActual", AccederUsuarioAutenticado.getIdAndNombre(p));
		
		return "Pagina_Chat";
	}
	
	
	
	
	@PostMapping("login/formularioRegistro/validar")
	public String damePagina_Index_desdeRegistro(
			@Valid @ModelAttribute("usuario") Usuario usuario, 
			BindingResult resultadoValidacion,
			HttpServletRequest request,
			HttpServletResponse response,
			Model modelo,
			Principal p,
			@RequestParam("imagenPerfil") MultipartFile metadatosImagenPerfil) {

		
			if (resultadoValidacion.hasErrors()){
				System.out.println("Validacion de datos erronea. Usuario no guardado en BBDD.");
				return "Pagina_Registro";
			}
			
			System.out.println("Acceso exitoso!");
			
			modelo.addAttribute("UsuarioActual", AccederUsuarioAutenticado.getIdAndNombre(p));
			
			return "Pagina_Chat";
		
			
	}

	


	
}
