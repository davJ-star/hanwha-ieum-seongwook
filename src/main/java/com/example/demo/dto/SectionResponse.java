package com.example.demo.dto;

import com.example.demo.entity.ContentSection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionResponse {
    private String sectionName;
    private String content;

    public static SectionResponse from(ContentSection section) {
        SectionResponse response = new SectionResponse();
        response.sectionName = section.getSectionName();
        response.content = section.getContent();
        return response;
    }
}