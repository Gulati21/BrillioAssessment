package com.brillio.controller;

import com.brillio.model.Listing;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ObjectMapper objectMapper;
    private final String jsonFilePath;

    public ListingController(ObjectMapper objectMapper, @Value("${listings.file.path:src/main/resources/sample_listings.json}") String jsonFilePath) {
        this.objectMapper = objectMapper;
        this.jsonFilePath = jsonFilePath;
    }

    private List<Listing> loadListings() throws IOException {
        File file = new File(jsonFilePath);
        return objectMapper.readValue(file, new TypeReference<>() {});
    }

    @GetMapping
    public List<Listing> getAll() throws IOException {
        return loadListings();
    }

    @PostMapping("/filter")
    public List<Listing> filter(@RequestBody Listing filter) throws IOException {
        List<Listing> all = loadListings();
        if (filter == null) return all;
        
        return all.stream().filter(l -> {
            if (filter.getId() != null && !filter.getId().equals(l.getId())) return false;
            if (filter.getSource() != null && !filter.getSource().equals(l.getSource())) return false;
            if (filter.getAddress() != null && !filter.getAddress().equals(l.getAddress())) return false;
            if (filter.getCity() != null && !filter.getCity().equals(l.getCity())) return false;
            if (filter.getState() != null && !filter.getState().equals(l.getState())) return false;
            if (filter.getZip() != null && !filter.getZip().equals(l.getZip())) return false;
            if (filter.getPrice() != 0 && filter.getPrice() != l.getPrice()) return false;
            if (filter.getBedrooms() != 0 && filter.getBedrooms() != l.getBedrooms()) return false;
            if (filter.getBathrooms() != 0 && filter.getBathrooms() != l.getBathrooms()) return false;
            if (filter.getSquareFootage() != 0 && filter.getSquareFootage() != l.getSquareFootage()) return false;
            if (filter.getLatitude() != 0 && filter.getLatitude() != l.getLatitude()) return false;
            if (filter.getLongitude() != 0 && filter.getLongitude() != l.getLongitude()) return false;
            if (filter.getListedDate() != null && !filter.getListedDate().equals(l.getListedDate())) return false;
            if (filter.getStatus() != null && !filter.getStatus().equals(l.getStatus())) return false;
            if (filter.getDescription() != null && !filter.getDescription().equals(l.getDescription())) return false;
            return true;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Listing add(@RequestBody Listing listing) throws IOException {
        List<Listing> all = loadListings();
        
        // Uniqueness check
        boolean exists = all.stream().anyMatch(l -> 
            l.getSource().equals(listing.getSource()) && l.getId().equals(listing.getId())
        );
        
        if (exists) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Listing already exists with same source and id");
        }
        
        all.add(listing);
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(jsonFilePath), all);
        return listing;
    }
}
