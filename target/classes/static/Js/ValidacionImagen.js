$(document).ready(function(){
	
	var campoImagen;
	var btn;
	var mensajeError;
	
	var nombreImagen;
	
	if ( $("#campoMetadatosImagen").length > 0 ){
		
		campoImagen = $("#campoMetadatosImagen");
		btn = $("#btnRegistrar");
		mensajeError = $("#mensajeError_MetadatosImagen");
	}
	else if ( $("#campoNuevaImagen").length > 0 ){
		
		campoImagen = $("#campoNuevaImagen");
		btn = $("#botonEditarImagen");
		mensajeError = $("#mensajeError_ActualizarImagen");
		
		nombreImagen = $("#datosUsuario").attr("data-NombreImagen");
		
		if ( nombreImagen === "SinImagen.png" ) {
		
			btn.prop("disabled", true);			
			mensajeError.hide();
		}
	}
	
	

	
	
	
	
	campoImagen.on("input", function(){
		
		var metadatosImagen = $(this)[0];
		
		var extension = $(this).val().split(".").pop();
		
		
		btn.prop("disabled", false);			
		mensajeError.hide();
		
		
		if ( metadatosImagen.files.length > 0 ){
			
			if ( extension === "png" || extension === "jpg" ){
			
				if ( metadatosImagen.files[0].size > (1*1024*1024) ){
					
					btn.prop("disabled", true);
					
					mensajeError.css({ display:"block" });
					
					mensajeError.text("La imagen es demasiado grande. Elije una mas pequeña");
				}
			}
			else{
				
				btn.prop("disabled", true);
					
				mensajeError.css({ display:"block" });
				
				mensajeError.text("Permitidos solamente archivos de imagen jpg o png");
			}	
		}
		else{
			
			if ( nombreImagen === "SinImagen.png" ) {
		
				btn.prop("disabled", true);			
			}
		}

		
		

	});
});
