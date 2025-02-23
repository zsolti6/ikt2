using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using halak.Models;

namespace halak.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HalakController : ControllerBase
    {
        private readonly HalakDbContext _context;

        public HalakController(HalakDbContext context)
        {
            _context = context;
        }

        // GET: api/Halak
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Halak>>> GetHalak()
        {
            return await _context.Halaks.ToListAsync();
        }

        // GET: api/Halak/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Halak>> GetHalak(int id)
        {
            var halak = await _context.Halaks.FindAsync(id);

            if (halak == null)
            {
                return NotFound();
            }

            return halak;
        }

        [HttpGet("halak-tavakkal")]
        public IActionResult GetHalakTavakkal()
        {
            var halakTavakkal = _context.Halaks
                .Include(h => h.To)
                .Select(h => new
                {
                    HalNev = h.Nev,
                    ToNev = h.To.Nev
                })
                .ToList();

            return Ok(halakTavakkal);
        }

        [HttpGet("legnagyobb-halak")]
        public async Task<IActionResult> GetLegnagyobbHalak()
        {
            var legnagyobbHalak = await _context.Halaks
                .OrderByDescending(h => h.MeretCm)
                .Take(3)
                .Select(h => new { h.Nev, h.MeretCm })
                .ToListAsync();

            return Ok(legnagyobbHalak);
        }


        // PUT: api/Halak/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHalak(int id, Halak halak)
        {
            if (id != halak.Id)
            {
                return BadRequest();
            }

            _context.Entry(halak).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HalakExists(id))
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

        // POST: api/Halak
        [HttpPost]
        public async Task<ActionResult<Halak>> PostHalak(Halak halak)
        {
            _context.Halaks.Add(halak);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHalak), new { id = halak.Id }, halak);
        }

        // DELETE: api/Halak/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHalak(int id)
        {
            var halak = await _context.Halaks.FindAsync(id);
            if (halak == null)
            {
                return NotFound();
            }

            _context.Halaks.Remove(halak);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HalakExists(int id)
        {
            return _context.Halaks.Any(e => e.Id == id);
        }
    }
}
