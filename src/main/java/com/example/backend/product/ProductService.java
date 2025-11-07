package com.example.backend.product;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
  private final ProductRepository repo;
  public ProductService(ProductRepository repo) { this.repo = repo; }

  public List<Product> findAll() { return repo.findAll(); }
  public Product create(Product p) { return repo.save(p); }
  public Product update(Long id, Product p) {
    return repo.findById(id).map(e -> {
      e.setName(p.getName());
      e.setPrice(p.getPrice());
      e.setStock(p.getStock());
      return repo.save(e);
    }).orElseThrow(() -> new RuntimeException("Not found"));
  }
  public void delete(Long id) { repo.deleteById(id); }
}
