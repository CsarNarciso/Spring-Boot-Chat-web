package com.cesar.ChatWeb;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@Configuration
public class Configuracion_RecursosExternos implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/ImagenesDePerfil/**").addResourceLocations("file:C:/Users/cesar/Desktop/Programacion/SPRING/Practica/ChatWeb/src/main/resources/ImagenesDePerfil/");
        
    }
}
