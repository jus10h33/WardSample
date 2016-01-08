using System.ComponentModel.DataAnnotations;

namespace SampleData.Models
{
	public class PastCropModels
	{
        [Key]
        [Required]
        public int PastCropNumber { get; set; }
        public string PastCropName { get; set; }
        public double NitrogenCredit { get; set; }
	}
}