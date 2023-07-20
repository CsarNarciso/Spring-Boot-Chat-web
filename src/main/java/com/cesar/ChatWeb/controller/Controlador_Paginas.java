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
	public String dameLogin() {
        return "Login";
	}
	


	@RequestMapping("/login/formularioRegistro")
	public String damePagina_Registro(Model modelo){

		modelo.addAttribute("usuario", new Usuario());

		return "Pagina_Registro";
	}
	
	

	
	@PostMapping("login/formularioRegistro/validar")
	public String damePagina_Index_desdeRegistro(
			@Valid @ModelAttribute("usuario") Usuario usuario, 
			BindingResult resultadoValidacion,
			@RequestParam("imagenPerfil") MultipartFile metadatosImagenPerfil,
			HttpServletRequest httpRequest,
			Model modelo
			) {

		
			//Guardar contraseña con formato original
			String contraseña = usuario.getContraseña();
		
		
		
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
				
				
				UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getNombre());
				System.out.println("1");
				
				System.out.println("Nombre: " + userDetails.getUsername() + "\n" +
					"Contraseña: " + userDetails.getPassword() + "\n" +
					"Roles: " + userDetails.getAuthorities());
				
				
				
				
				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					userDetails,
					contraseña,
					userDetails.getAuthorities()
				);
				System.out.println("2");
				
				
				
				Authentication auth = null;
				
				
				try {
					auth = autManager.authenticate(token);
					System.out.println("3");
				}catch(Exception e) {
					e.printStackTrace();
				}
				
				
				
				SecurityContext sc = SecurityContextHolder.getContext();
				System.out.println("4");
				
				
				
				sc.setAuthentication(auth);
				System.out.println("5");
				
				
				HttpSession session = httpRequest.getSession(true);
				System.out.println("6");
				
				session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);
				System.out.println("7");
				
				
				
				if ( sc.getAuthentication().isAuthenticated() ) {
					
					System.out.println("Usuario autenticado");
				}
				else {
					
					System.out.println("Usuario NO autenticado");
				}
				
				
				
				//Cargar datos de usuario autenticado en el modelo

				AccederUsuarioAutenticado accederUsuarioAutenticado = new AccederUsuarioAutenticado(userRepo);
				
				modelo.addAttribute("DatosUsuario", accederUsuarioAutenticado.getDatos());

				System.out.println("datos de usuario autenticado cargados en el modelo");
				
	
				//Dar acceso. Redirigir a pagina de chat
				
				System.out.println("Acceso exitoso!");
				
				return "redirect:/chat";
				
		}
		
	}
	
	
	@RequestMapping("/chat")
	public String dameChat(){
		
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
