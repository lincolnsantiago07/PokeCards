package com.lincoln.pokecards.controller;

import com.lincoln.pokecards.cards.Cards;
import com.lincoln.pokecards.cards.CardsRepository;
import com.lincoln.pokecards.cards.CardsRequestDTO;
import com.lincoln.pokecards.cards.CardsResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@RestController
@RequestMapping("cards")
public class CardsController {

    private static final Set<String> ALLOWED_SORTS = Set.of("name", "rarity", "price");

    @Autowired
    private CardsRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping
    public void saveCards(@RequestBody CardsRequestDTO data) {
        repository.save(new Cards(data));
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping
    public Page<CardsResponseDTO> getAll(
            @PageableDefault(size = 250, sort = "name", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        validateSort(pageable);
        return repository.findAll(pageable).map(CardsResponseDTO::new);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/search")
    public Page<CardsResponseDTO> search(
            @RequestParam(name = "q", required = false) String q,
            @PageableDefault(size = 250, sort = "name", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        validateSort(pageable);
        Page<Cards> page = (q == null || q.isBlank())
                ? repository.findAll(pageable)
                : repository.searchByQuery(q, pageable);
        return page.map(CardsResponseDTO::new);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/suggest")
    public java.util.List<String> suggest(
            @RequestParam("q") String q,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return repository.suggestNames(q, PageRequest.of(0, limit))
                .stream().map(Cards::getName).distinct().toList();
    }

    private void validateSort(Pageable pageable) {
        boolean ok = pageable.getSort().stream()
                .allMatch(o -> ALLOWED_SORTS.contains(o.getProperty()));
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Parâmetro sort inválido. Use: name, rarity ou price.");
        }
    }
}
