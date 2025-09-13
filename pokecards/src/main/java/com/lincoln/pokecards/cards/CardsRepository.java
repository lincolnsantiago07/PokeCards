package com.lincoln.pokecards.cards;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CardsRepository extends JpaRepository<Cards, String> {
}