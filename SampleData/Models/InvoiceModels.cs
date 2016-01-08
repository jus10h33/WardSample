using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class InvoiceModels
    {        
        private int Row { get; set; }
        [Key]
        [Column(Order = 1)]
        [Required]
        public int InvoiceNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int CustomerNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 4)]
        [Required]
        public int BatchNumber { get; set; }
        public DateTime DateReported { get; set; }
        public double PostageCost { get; set; }
        public string Comments { get; set; }
        public double CustomerDiscount { get; set; }
        public byte Locked { get; set; }
    }
}