package com.example.backend.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank private String name;
  @NotNull @DecimalMin("0.0") private BigDecimal price;
  @NotNull @Min(0) private Integer stock;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
  public Integer getStock() { return stock; }
  public void setStock(Integer stock) { this.stock = stock; }
}
