using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using halak.Models;

[Route("api/[controller]")]
[ApiController]
public class FogasokController : ControllerBase
{
    private readonly HalakDbContext _context;

    public FogasokController(HalakDbContext context)
    {
        _context = context;
    }

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
}
