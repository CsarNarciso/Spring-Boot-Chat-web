 package com.cesar.ChatWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.cesar.ChatWeb.validation.Usuario_Validador;
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

		modelo.addAttribute("usuario", new Usuario_Validador());

		return "Pagina_Registro";
	}





	@PostMapping("/registro/validar")
	public String validarRegistro(

			@Valid @ModelAttribute("usuario") Usuario_Validador usuario,
			BindingResult resultadoValidacion,
			@RequestParam("metadatosImagen") MultipartFile metadatosImagen,
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


				//Nombre existene

			if ( userRepo.findByNombre( usuario.getNombre() ) != null ) {

				resultadoValidacion.addError(new FieldError("usuario", "nombre", "Nombre no dispoinble"));
			}
			

				
			//Incorrecto

			if (resultadoValidacion.hasErrors()){

				System.out.println("Validacion de datos erronea. Usuario no guardado en BBDD.");
				return "Pagina_Registro";
			}

			//Correcto

			else {


				//Subir ususario a BBDD

				Usuario usuarioValidado = new Usuario();

				usuarioValidado.setNombre( usuario.getNombre() );
				usuarioValidado.setEmail( usuario.getEmail() );
				usuarioValidado.setContraseña(passwordEncoder.encode(usuario.getContraseña()));

				userRepo.save(usuarioValidado);
				System.out.println("Subiendo usuario " + usuarioValidado.getNombre() + " a BBDD...");



				//Guardar imagen de perfil en servidor y en BBDD

				Usuario usuarioGuardado = userRepo.buscarPorNombre_Email(usuarioValidado.getNombre());
				Long idUsuario = usuarioGuardado.getId();

				ActualizarDatosUsuario actualizarDatosUsuario = new ActualizarDatosUsuario(userRepo, conversacionRepo);

				actualizarDatosUsuario.guardarImagenPerfil(metadatosImagen, idUsuario);



				//Autenticar

				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					usuarioValidado.getNombre(),
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
	
	
	

	
	@PostMapping("/actualizarDatosUsuario")
	public String actualizarDatosUsuario( 
			@RequestParam(name = "nuevoNombre", required = false) String nuevoNombre,
			@RequestParam(name = "nuevaImagen", required = false) MultipartFile nuevaImagen,
			HttpServletRequest httpRequest, HttpSession sesion
			) {
		
		
		//Obtener datos para actualizar.
		
		Long idUsuarioActual = new AccederUsuarioAutenticado(userRepo).getDatos().getId(); 
		
		//Nombre de usuario.
		
		if ( nuevoNombre != null ) {
			
			
			//Validar.


			//Nombre existene.

			if ( userRepo.findByNombre( nuevoNombre ) != null ) {
	
				//Incorrecto.
				
				//Agregar resultado de validacion en sesion.
				sesion.setAttribute("ResultadoValidacion_ActualizarNombre", "Incorrecta");
				sesion.setAttribute("NombreNoDisponible", nuevoNombre);
				
				return "redirect:/chat";
			}
			
			//Correcto.

			//Agregar actualizacion en sesion
			sesion.setAttribute("Actualizar", "Nombre");
			
			sesion.setAttribute("ResultadoValidacion_ActualizarNombre", "Correcta");
			
			//Actualizar en BBDD.
			
			userRepo.updateNombre( nuevoNombre, idUsuarioActual );
			
			//En Autenticacion. 
			
			UsernamePasswordAuthenticationToken newToken = new UsernamePasswordAuthenticationToken( nuevoNombre, null, null );

			SecurityContextHolder.getContext().setAuthentication( newToken );
		}
		
		//Imagen de usuario.
		
		else if ( nuevaImagen != null ) {
			
			//Actualizar en BBDD y en archivos de Servidor.
			
			new ActualizarDatosUsuario(userRepo, conversacionRepo).guardarImagenPerfil(nuevaImagen, idUsuarioActual);
			
			//Agregar actualizacion en sesion
			sesion.setAttribute("Actualizar", "Imagen");
		}
		
		
		//Actualizacion de datos correcta. Redirigir a chat.
		
		return "redirect:/chat";
	}





	@RequestMapping({"/chat", "/"})
	public String chat(Model modelo, HttpSession sesion){
	
		
		//TRAS ACTUALIZAR (?)
		
		String actualizar = (String) sesion.getAttribute("Actualizar");
		
		if ( actualizar != null ) {
			
			//Nombre (?)
			
			if ( actualizar == "Nombre" ) {
				
				//Obtener resultado de validacion
				
				String resultadoValidacion_ActualizarNombre = (String) sesion.getAttribute("ResultadoValidacion_ActualizarNombre"); 
				String nombreNoDisponible = (String) sesion.getAttribute("NombreNoDisponible"); 
				
				//Y eliminarlo de la sesion
				
				sesion.removeAttribute("ResultadoValidacion_ActualizarNombre");
				
				//Agregar resultado a modelo.
				
				modelo.addAttribute("ResultadoValidacion_ActualizarNombre", resultadoValidacion_ActualizarNombre);
				
				//Si la validacion fue erronea, agregar nombre no disponible
				
				if ( resultadoValidacion_ActualizarNombre == "Incorrecta" ) {
					
					modelo.addAttribute("NombreNoDisponible", nombreNoDisponible);
					
					//Y eliminarlo de la sesion
					sesion.removeAttribute("NombreNoDisponible");
				}
			}
			
			//Imagen (?) Ninguna accion
			

			//Agregar Actualizar a modelo
			modelo.addAttribute("Actualizar", actualizar);	
			
			//Y eliminarlo de la sesion
			sesion.removeAttribute("Actualizar");
		}
		
		

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
