 package com.cesar.ChatWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;
import com.cesar.Methods.AccederUsuarioAutenticado;
import com.cesar.Methods.ActualizarDatosUsuario;

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
	public String dameIndex_desdeLogin(Model modelo){
		
		AccederUsuarioAutenticado accederUsuarioAutenticado = new AccederUsuarioAutenticado(userRepo);
		
		modelo.addAttribute("DatosUsuario", accederUsuarioAutenticado.getDatos());
	
		return "Pagina_Chat";
	}
	
	@RequestMapping("/ii")
	public String dameI(){

		return "Pagina_Chat";
	}
	
	
	@PostMapping("login/formularioRegistro/validar")
	public String damePagina_Index_desdeRegistro(
			@Valid @ModelAttribute("usuario") Usuario usuario, 
			BindingResult resultadoValidacion,
			@RequestParam("imagenPerfil") MultipartFile metadatosImagenPerfil,
			Model modelo
			) {

		
			//Comprobar registro
		
		
			//Incorrecto
		
			if (resultadoValidacion.hasErrors()){
			
				System.out.println("Validacion de datos erronea. Usuario no guardado en BBDD.");
				return "Pagina_Registro";
			}
			
			//Correcto
			
			else {
				
				//Subir ususario a BBDD
				
				usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));

				userRepo.save(usuario);
				System.out.println("Subiendo usuario " + usuario.getNombre() + " a BBDD...");
				
	
				
				//Guardar imagen de perfil en servidor y en BBDD
				
				Usuario usuarioGuardado = userRepo.buscarPorNombre_Email(usuario.getNombre());
				Long idUsuario = usuarioGuardado.getId();
				
				ActualizarDatosUsuario actualizarDatosUsuario = new ActualizarDatosUsuario(userRepo, conversacionRepo);
				actualizarDatosUsuario.guardarImagenPerfil(metadatosImagenPerfil, idUsuario);
				
				
				
				//Autenticar 
				
				
			
			
				
			
				//Cargar datos de usuario autenticado en el modelo

				AccederUsuarioAutenticado accederUsuarioAutenticado = new AccederUsuarioAutenticado(userRepo);
				
				modelo.addAttribute("DatosUsuario", accederUsuarioAutenticado.getDatos());
				
				
				
				//Dar acceso. Redirigir a pagina de chat
				
				System.out.println("Acceso exitoso!");
				
				return "redirect:/ii";
				
		}
		
	}

	
	@Autowired 
	private PasswordEncoder passwordEncoder;
	@Autowired
	private Usuario_Repositorio userRepo;
	@Autowired
	private Conversacion_Repositorio conversacionRepo;

	
}
