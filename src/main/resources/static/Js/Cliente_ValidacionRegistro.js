$(document).ready(function(){
	
	$("#campoMetadatosImagen").on("input", function(){
		
		var metadatosImagen = $(this)[0];
		
		if ( metadatosImagen.files.length > 0 ){
			
			if ( metadatosImagen.files[0].size > (1*1024*1024) ){
				
				$("#btnRegistrar").prop("disabled", true);
				
				$("#mensajeError_MetadatosImagen").css({ display:"block" })
			}
			else{
				
				$("#btnRegistrar").prop("disabled", false);
				
				$("#mensajeError_MetadatosImagen").hide();
			}
		}
		else{
			
			$("#btnRegistrar").prop("disabled", false);
			
			$("#mensajeError_MetadatosImagen").hide();
		}
		
		

	});
});
