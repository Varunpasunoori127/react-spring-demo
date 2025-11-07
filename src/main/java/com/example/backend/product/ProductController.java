package com.example.backend.product;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService service;
  public ProductController(ProductService service) { this.service = service; }

  @GetMapping public List<Product> all() { return service.findAll(); }

  @PostMapping public Product create(@Valid @RequestBody Product p) { return service.create(p); }

  @PutMapping("/{id}") public Product update(@PathVariable Long id, @Valid @RequestBody Product p) {
    return service.update(id, p);
  }

  @DeleteMapping("/{id}") public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
