 package com.cesar.ChatWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;
import com.cesar.ChatWeb.service.Usuario_UserDetailsService;
import com.cesar.Methods.AccederUsuarioAutenticado;
import com.cesar.Methods.ActualizarDatosUsuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class Controlador_Paginas {
	

	@RequestMapping("/login")
	public String login() {
        return "Login";
	}
	


	@RequestMapping("/registro")
	public String registro(Model modelo){

		modelo.addAttribute("usuario", new Usuario());

		return "Pagina_Registro";
	}
	
	
	

	
	@PostMapping("/registro/validar")
	public String validarRegistro(
			
			@Valid @ModelAttribute("usuario") Usuario usuario, 
			BindingResult resultadoValidacion,
			@RequestParam("imagenPerfil") MultipartFile metadatosImagenPerfil,
			HttpServletRequest httpRequest,
			Model modelo
			) {

		
		
			//Almacenar contraseña original para autenticar
			String contraseña = usuario.getContraseña();
		
		
			
			//Validar
			
			
				//Email existene
			
			if ( userRepo.findByEmail( usuario.getEmail() ) != null ) {
				
				resultadoValidacion.addError(new FieldError("usuario", "email", "Este email ya esta siendo utilizado"));
			}
			

		
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

				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					usuario.getNombre(),
					contraseña
				);
				
				Authentication auth = autManager.authenticate(token);

				SecurityContext sc = SecurityContextHolder.getContext();

				sc.setAuthentication(auth);

				HttpSession session = httpRequest.getSession(true);
				
				session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);
				
				
				
				//Dar acceso. Redirigir a pagina de chat

				return "redirect:/chat";
				
		}
		
	}
	
	
	
	
	
	@RequestMapping({"/chat", "/"})
	public String chat(Model modelo){
		
		AccederUsuarioAutenticado accederUsuarioAutenticado = new AccederUsuarioAutenticado(userRepo);
		
		Usuario u = accederUsuarioAutenticado.getDatos();
		
		modelo.addAttribute("DatosUsuario", u);

		System.out.println("datos de usuario autenticado cargados en el modelo");
		
		System.out.println(u);
		System.out.println(u.getNombre());
		System.out.println(u.getContraseña());
		System.out.println(u.getEmail());
		System.out.println(u.getNombreImagen());
		
		return "Pagina_Chat";
	}

	
	
	
	@Autowired 
	private PasswordEncoder passwordEncoder;
	@Autowired 
	private AuthenticationManager autManager;
	@Autowired 
	private Usuario_UserDetailsService userDetailsService;
	@Autowired
	private Usuario_Repositorio userRepo;
	@Autowired
	private Conversacion_Repositorio conversacionRepo;

	
}
