package com.brillio.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class Listing {
    private String id;
    private String source;
    private String address;
    private String city;
    private String state;
    private String zip;
    private double price;
    private int bedrooms;
    private float bathrooms;
    @JsonProperty("sqft")
    private int squareFootage;
    private float latitude;
    private float longitude;
    private Date listedDate;
    private String status;
    private String description;
}
