package com.lincoln.pokecards.cards;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "pokecards")
@Entity(name = "cards")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Cards {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String name;
    private String image_large;
    private Double price;
    private String rarity;

    public Cards(CardsRequestDTO data){
        this.image_large = data.image_large();
        this.price = data.price();
        this.rarity = data.rarity();
        this.name = data.name();
    }
}