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
			

				//Imagen
			
			if ( usuario.getMetadatosImagen() != null ) { 
				
				if ( ! usuario.getMetadatosImagen().isEmpty() ) {

					String tipoExtension = usuario.getMetadatosImagen().getContentType();
					
					if ( tipoExtension.equals("image/jpeg") || tipoExtension.equals("image/png") ) {
						
						//Tamaño excesivo
						
						if ( usuario.getMetadatosImagen().getSize() > (1*1024*1024) ) {
	
							resultadoValidacion.addError(new FieldError("usuario", "metadatosImagen", "Imagen demasiado grande"));
						}
					}
					
					//Extension incorrecta
					
					else {
						
						resultadoValidacion.addError(new FieldError("usuario", "metadatosImagen", "Permitidos solamente archivos jpg o png"));
					}
				
				}
				
				

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

				actualizarDatosUsuario.guardarImagenPerfil(usuario.getMetadatosImagen(), idUsuario);



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
