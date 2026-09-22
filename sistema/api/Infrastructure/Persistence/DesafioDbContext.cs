using Desafio.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Desafio.Api.Infrastructure.Persistence;

public class DesafioDbContext(DbContextOptions<DesafioDbContext> opcoes) : DbContext(opcoes)
{
    /// <summary>
    /// O SQLite guarda data e hora como texto e as devolve sem fuso. O conversor marca os valores
    /// lidos como UTC para que a API sempre responda no formato ISO 8601 com sufixo "Z" (RN-02).
    /// </summary>
    private static readonly ValueConverter<DateTime, DateTime> ConversorParaUtc = new(
        valor => valor,
        valor => DateTime.SpecifyKind(valor, DateTimeKind.Utc));

    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder construtor)
    {
        var usuario = construtor.Entity<Usuario>();

        usuario.ToTable("Usuarios");
        usuario.HasKey(u => u.Id);

        usuario.Property(u => u.Nome).IsRequired().HasMaxLength(120);
        usuario.Property(u => u.Login).IsRequired().HasMaxLength(40);
        usuario.Property(u => u.Email).IsRequired().HasMaxLength(160);
        usuario.Property(u => u.SenhaHash).IsRequired().HasMaxLength(100);
        usuario.Property(u => u.CriadoEm).IsRequired().HasConversion(ConversorParaUtc);
        usuario.Property(u => u.AtualizadoEm).HasConversion(ConversorParaUtc);

        // RN-08: a unicidade do login é conferida no caso de uso e sustentada também por índice único
        // na coluna, como o documento exige.
        usuario.HasIndex(u => u.Login);
    }
}
