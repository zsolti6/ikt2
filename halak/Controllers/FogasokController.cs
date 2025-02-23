using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using halak.Models;
using halak.DTOs;

[Route("api/[controller]")]
[ApiController]
public class FogasokController : ControllerBase
{
    private readonly HalakDbContext _context;

    public FogasokController(HalakDbContext context)
    {
        _context = context;
    }

    // GET: api/Fogasok
    [HttpGet]
    public IActionResult GetFogasok()
    {
        var fogasok = _context.Fogasoks
            .Include(f => f.Horgasz)
            .Include(f => f.Hal)
            .Select(f => new
            {
                HorgaszNeve = f.Horgasz.Nev,
                HalNeve = f.Hal.Nev,
                FogasDatuma = f.Datum
            })
            .ToList();

        return Ok(fogasok);
    }

    // GET: api/Fogasok/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFogas(int id)
    {
        var fogas = await _context.Fogasoks
            .Include(f => f.Horgasz)
            .Include(f => f.Hal)
            .Where(f => f.Id == id)
            .Select(f => new
            {
                HorgaszNeve = f.Horgasz.Nev,
                HalNeve = f.Hal.Nev,
                FogasDatuma = f.Datum
            })
            .FirstOrDefaultAsync();

        if (fogas == null)
        {
            return NotFound();
        }

        return Ok(fogas);
    }

    // POST: api/Fogasok
    [HttpPost]
    public async Task<ActionResult<FogasDTO>> PostFogas(FogasDTO fogasDto)
    {
        var fogas = new Fogasok
        {
            HorgaszId = fogasDto.HorgaszId,
            HalId = fogasDto.HalId,
            Datum = fogasDto.Datum
        };

        _context.Fogasoks.Add(fogas);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFogas), new { id = fogas.Id }, fogasDto);
    }

    // PUT: api/Fogasok/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFogas(int id, FogasDTO fogasDto)
    {
        if (id != fogasDto.Id)
        {
            return BadRequest();
        }

        var fogas = await _context.Fogasoks.FindAsync(id);
        if (fogas == null)
        {
            return NotFound();
        }

        fogas.HorgaszId = fogasDto.HorgaszId;
        fogas.HalId = fogasDto.HalId;
        fogas.Datum = fogasDto.Datum;

        _context.Entry(fogas).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FogasExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Fogasok/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFogas(int id)
    {
        var fogas = await _context.Fogasoks.FindAsync(id);
        if (fogas == null)
        {
            return NotFound();
        }

        _context.Fogasoks.Remove(fogas);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FogasExists(int id)
    {
        return _context.Fogasoks.Any(e => e.Id == id);
    }
}