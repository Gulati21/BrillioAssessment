package com.brillio.controller;

import com.brillio.model.Listing;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import java.nio.file.Files;

import java.io.File;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "listings.file.path=src/test/resources/listings.json")
public class ListingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void resetFile() throws Exception {
        // Copy master test listings to listings.json to reset state
        File master = new File("src/test/resources/test_listings.json");
        File target = new File("src/test/resources/listings.json");
        Files.copy(master.toPath(), target.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/api/listings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(12))
                .andExpect(jsonPath("$[0].id").value("A1"))
                .andExpect(jsonPath("$[11].id").value("A7"));
    }

    @Test
    public void testAddAndFilter() throws Exception {
        Listing listing = new Listing();
        listing.setId("1");
        listing.setSource("testSource");
        listing.setAddress("123 Test St");

        // Add listing
        mockMvc.perform(post("/api/listings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listing)))
                .andExpect(status().isOk());

        // Filter listing
        Listing filter = new Listing();
        filter.setSource("testSource");

        mockMvc.perform(post("/api/listings/filter")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(filter)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));

        // Test duplicate add
        mockMvc.perform(post("/api/listings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listing)))
                .andExpect(status().isForbidden());
    }
}
