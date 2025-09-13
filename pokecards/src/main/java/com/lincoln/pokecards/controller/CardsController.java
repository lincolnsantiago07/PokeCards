package com.lincoln.pokecards.controller;

import com.lincoln.pokecards.cards.Cards;
import com.lincoln.pokecards.cards.CardsRepository;
import com.lincoln.pokecards.cards.CardsRequestDTO;
import com.lincoln.pokecards.cards.CardsResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("cards")
public class CardsController {

    @Autowired
    private CardsRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public void saveCards(@RequestBody CardsRequestDTO data){
        Cards cardsData = new Cards(data);
        repository.save(cardsData);
        return;
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public List<CardsResponseDTO> getAll(){

        List<CardsResponseDTO> cardsList = repository.findAll().stream().map(CardsResponseDTO::new).toList();
        return cardsList;
    }
}
