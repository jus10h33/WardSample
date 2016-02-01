using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class SoilRecViewModel
    {
        public int BatchNumber { get; set; }
        public int LabNumber { get; set; }
        public int Priority { get; set; }
        public int RecTypeNumber { get; set; }
        public string RecTypeName { get; set; }
        public int CropTypeNumber { get; set; }
        public string CropTypeName { get; set; }
        public double YieldGoal { get; set; }

        public override string ToString()
        {
            return "BatchNumber: " + BatchNumber +
                "\nLabNumber: " + LabNumber +
                "\nPriority: " + Priority +
                "\nRecTypeNumber: " + RecTypeNumber +
                "\nRecTypeName: " + RecTypeName +
                "\nCropTypeNumber: " + CropTypeNumber +
                "\nCropTypeName: " + CropTypeName +
                "\nYieldGoal: " + YieldGoal;
        }
    }
}