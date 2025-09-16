package com.lincoln.pokecards.cards;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface CardsRepository extends JpaRepository<Cards, Long> {
    @Query("""
        select c from cards c
        where lower(c.name) like lower(concat('%', :q, '%'))
           or lower(c.rarity) like lower(concat('%', :q, '%'))
    """)
    Page<Cards> searchByQuery(@Param("q") String q, Pageable pageable);

    @Query("""
        select c from cards c
        where lower(c.name) like lower(concat('%', :q, '%'))
        order by c.name asc
    """)
    java.util.List<Cards> suggestNames(@Param("q") String q, Pageable pageable);
}
