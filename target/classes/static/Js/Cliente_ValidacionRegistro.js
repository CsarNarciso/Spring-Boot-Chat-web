$(document).ready(function(){
	
	$("#campoMetadatosImagen").on("input", function(){
		
		var metadatosImagen = $(this)[0];
		
		var extension = $(this).val().split(".").pop();
		
		
		$("#btnRegistrar").prop("disabled", false);			
		$("#mensajeError_MetadatosImagen").hide();
		
		
		if ( metadatosImagen.files.length > 0 ){
			
			if ( extension === "png" || extension === "jpg" ){
			
				if ( metadatosImagen.files[0].size > (1*1024*1024) ){
					
					$("#btnRegistrar").prop("disabled", true);
					
					$("#mensajeError_MetadatosImagen").css({ display:"block" });
					
					$("#mensajeError_MetadatosImagen").text("La imagen es demasiado grande. Elije una mas pequeña");
				}
			}
			else{
				
				$("#btnRegistrar").prop("disabled", true);
					
				$("#mensajeError_MetadatosImagen").css({ display:"block" });
				
				$("#mensajeError_MetadatosImagen").text("Permitidos solamente archivos de imagen jpg o png");
			}	
		}

		
		

	});
});
