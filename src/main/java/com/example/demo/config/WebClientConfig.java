package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriBuilderFactory;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder builder){
        UriBuilderFactory factory = new DefaultUriBuilderFactory();
        ((DefaultUriBuilderFactory) factory).setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        return builder
                .uriBuilderFactory(factory)
                .build();
    }

    @Bean
    public WebClient ocrWebClient() {
        return WebClient.builder()
                .baseUrl("http://13.125.219.74:8001")
                .build();
    }

    @Bean
    public WebClient fastApiClient() {
        return WebClient.builder()
                .baseUrl("http://13.125.219.74:8001")
                .build();
    }
}