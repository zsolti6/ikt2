using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using halak.Models;
using halak.DTOs;
using System;

namespace halak.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorgaszDTOesController : ControllerBase
    {
        private readonly HalakDbContext _context;

        public HorgaszDTOesController(HalakDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HorgaszDTO>>> GetHorgaszok()
        {
            var horgaszok = await _context.Horgaszoks
                .Include(h => h.Fogasoks)
                .ThenInclude(f => f.Hal)
                .Select(h => new HorgaszDTO
                {
                    Nev = h.Nev,
                    Eletkor = h.Eletkor,
                    Fogasok = h.Fogasoks.Select(f => new FogasDTO
                    {
                        Id =f.Id,
                        Datum = f.Datum,
                        HalNev = f.Hal.Nev,
                        HalFaj = f.Hal.Faj
                    }).ToList()
                })
                .ToListAsync();

            return Ok(horgaszok);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HorgaszDTO>> GetHorgasz(int id)
        {
            var horgasz = await _context.Horgaszoks
                .Include(h => h.Fogasoks)
                .ThenInclude(f => f.Hal)
                .Where(f => f.Id == id)
                .Select(h => new HorgaszDTO
                {
                    Nev = h.Nev,
                    Eletkor = h.Eletkor,
                    Fogasok = h.Fogasoks.Select(f => new FogasDTO
                    {
                        Id=f.Id,
                        Datum = f.Datum,
                        HalNev = f.Hal.Nev,
                        HalFaj = f.Hal.Faj
                    }).ToList()
                })
                .FirstOrDefaultAsync();
              
                
            if (horgasz == null)
            { 
                return NotFound();
            }

            return Ok(horgasz);
        }

        [HttpPost]
        public async Task<ActionResult<HorgaszDTO>> PostHorgasz(HorgaszCreateDTO horgaszDTO)
        {
            var horgasz = new Horgaszok
            {
                Nev = horgaszDTO.Nev,
                Eletkor = horgaszDTO.Eletkor
            };

            _context.Horgaszoks.Add(horgasz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHorgasz), new { id = horgasz.Id }, horgaszDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHorgasz(int id, HorgaszCreateDTO horgaszDTO)
        {
            var horgasz = await _context.Horgaszoks
       .Include(h => h.Fogasoks)
       .ThenInclude(f => f.Hal)
       .FirstOrDefaultAsync(h => h.Id == id);

            if (horgasz == null)
            {
                return NotFound();
            }

            horgasz.Nev = horgaszDTO.Nev;
            horgasz.Eletkor = horgaszDTO.Eletkor;

            var existingFogasIds = horgasz.Fogasoks.Select(f => f.Id).ToList();

            foreach (var fogasDTO in horgaszDTO.Fogasok)
            {
                if (fogasDTO.Id == null)
                {
                    var hal = await _context.Halaks
                        .FirstOrDefaultAsync(h => h.Nev == fogasDTO.HalNev && h.Faj == fogasDTO.HalFaj);

                    if (hal == null)
                    {
                        hal = new Halak { Nev = fogasDTO.HalNev, Faj = fogasDTO.HalFaj };
                        _context.Halaks.Add(hal);
                        await _context.SaveChangesAsync();
                    }

                    horgasz.Fogasoks.Add(new Fogasok
                    {
                        Datum = fogasDTO.Datum,
                        HalId = hal.Id,
                        HorgaszId = horgasz.Id
                    });
                }
                else
                {
                    var existingFogas = horgasz.Fogasoks.FirstOrDefault(f => f.Id == fogasDTO.Id);
                    if (existingFogas != null)
                    {
                        existingFogas.Datum = fogasDTO.Datum;

                        var hal = await _context.Halaks
                            .FirstOrDefaultAsync(h => h.Nev == fogasDTO.HalNev && h.Faj == fogasDTO.HalFaj);

                        if (hal == null)
                        {
                            hal = new Halak { Nev = fogasDTO.HalNev, Faj = fogasDTO.HalFaj };
                            _context.Halaks.Add(hal);
                            await _context.SaveChangesAsync();
                        }

                        existingFogas.HalId = hal.Id;
                    }
                }
            }

            var fogasIdsToKeep = horgaszDTO.Fogasok.Where(f => f.Id != null).Select(f => f.Id).ToList();
            var fogasToRemove = horgasz.Fogasoks
        .Where(f => !fogasIdsToKeep.Contains(f.Id))
        .ToList();

            foreach (var fogas in fogasToRemove)
            {
                _context.Fogasoks.Remove(fogas);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHorgasz(int id)
        {
            var horgasz = await _context.Horgaszoks.FindAsync(id);
            if (horgasz == null)
            {
                return NotFound();
            }

            _context.Horgaszoks.Remove(horgasz);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}