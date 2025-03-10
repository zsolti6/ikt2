using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using halak.Models;

namespace halak.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FogasokController : ControllerBase
    {
        private readonly HalakDbContext _context;

        public FogasokController(HalakDbContext context)
        {
            _context = context;
        }

        // GET: api/Fogasoks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFogasoks()
        {
            return await _context.Fogasoks.Include(x => x.Horgasz).Select(x => new { horgaszNeve = x.Horgasz.Nev, halNeve = x.Hal.Nev, fogasDatuma =  x.Datum}).ToListAsync();
        }

        // GET: api/Fogasoks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Fogasok>> GetFogasok(int id)
        {
            var fogasok = await _context.Fogasoks.FindAsync(id);

            if (fogasok == null)
            {
                return NotFound();
            }

            return fogasok;
        }


        // PUT: api/Fogasoks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFogasok(int id, Fogasok fogasok)
        {
            if (id != fogasok.Id)
            {
                return BadRequest();
            }

            _context.Entry(fogasok).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FogasokExists(id))
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

        // POST: api/Fogasoks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Fogasok>> PostFogasok(Fogasok fogasok)
        {
            _context.Fogasoks.Add(fogasok);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFogasok", new { id = fogasok.Id }, fogasok);
        }

        // DELETE: api/Fogasoks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFogasok(int id)
        {
            var fogasok = await _context.Fogasoks.FindAsync(id);
            if (fogasok == null)
            {
                return NotFound();
            }

            _context.Fogasoks.Remove(fogasok);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FogasokExists(int id)
        {
            return _context.Fogasoks.Any(e => e.Id == id);
        }
    }
}
