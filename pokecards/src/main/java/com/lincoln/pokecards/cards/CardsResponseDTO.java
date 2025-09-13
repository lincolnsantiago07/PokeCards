package com.lincoln.pokecards.cards;

public record CardsResponseDTO(String ID, String name, String image, Double price, String rarity) {
    public CardsResponseDTO(Cards cards){
        this(cards.getId(), cards.getName(), cards.getImage_large(), cards.getPrice(), cards.getRarity());
    }
}



