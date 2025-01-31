package com.example.demo.dto;


import lombok.Data;

import java.util.List;

    @Data
    public class DrugResponse {

        private Header header;
        private Body body;

        @Data
        public static class Header {
            private String resultCode;
            private String resultMsg;
        }

        @Data
        public static class Body {
            private int pageNo;
            private int totalCount;
            private int numOfRows;
            private List<SearchDto> items;
        }

    }