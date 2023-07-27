$(document).ready(function(){
	
	console.log("Documento listo")
	
	$("#campoMetadatosImagen").on("input", function(){
		
		var metadatosImagen = $(this)[0];
		
		if ( metadatosImagen.files.length > 0 ){
			
			if ( metadatosImagen.files[0].size > (1*1024*1024) ){
				
				$("#btnRegistrar").prop("disabled", true);
			}
			else{
				
				$("#btnRegistrar").prop("disabled", false);
			}
		}
		else{
			
			$("#btnRegistrar").prop("disabled", false);
		}
		
		

	});
});
