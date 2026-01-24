package com.techietact.myrems.helper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.techietact.myrems.entity.Layout;
import com.techietact.myrems.entity.Plot;
import com.techietact.myrems.repository.LayoutRepository;

public class ExcelHelper {

	public static List<Plot> convertExcelToPlots(InputStream is, LayoutRepository layoutRepo) {

	    List<Plot> plots = new ArrayList<>();

	    try (Workbook workbook = new XSSFWorkbook(is)) {

	        Sheet sheet = workbook.getSheetAt(0);

	        // 1️⃣ Read header row
	        Row headerRow = sheet.getRow(0);
	        Map<String, Integer> colMap = new HashMap<>();

	        for (Cell cell : headerRow) {
	            colMap.put(cell.getStringCellValue().trim().toLowerCase(), cell.getColumnIndex());
	        }

	        // 2️⃣ Read data rows
	        for (int i = 1; i <= sheet.getLastRowNum(); i++) {

	            Row row = sheet.getRow(i);
	            if (row == null) continue;

	            Plot plot = new Plot();

	            plot.setPlotNo(getStringCell(row.getCell(colMap.get("plot_no"))));
	            plot.setSqft((int) getNumericCell(row.getCell(colMap.get("sqft"))));
	            plot.setDirection(getStringCell(row.getCell(colMap.get("direction"))));

	            plot.setBreadthOne(getNumericCell(row.getCell(colMap.get("breadth_one"))));
	            plot.setBreadthTwo(getNumericCell(row.getCell(colMap.get("breadth_two"))));
	            plot.setLengthOne(getNumericCell(row.getCell(colMap.get("length_one"))));
	            plot.setLengthTwo(getNumericCell(row.getCell(colMap.get("length_two"))));

	            plot.setPrice(getNumericCell(row.getCell(colMap.get("price"))));
	            plot.setTotalSqft(getNumericCell(row.getCell(colMap.get("total_sqft"))));

	            plot.setAddress(getStringCell(row.getCell(colMap.get("address"))));
	            plot.setMobile((long) getNumericCell(row.getCell(colMap.get("mobile"))));
	            plot.setOwnerName(getStringCell(row.getCell(colMap.get("owner_name"))));
	            plot.setEmail(getStringCell(row.getCell(colMap.get("email"))));

	            plot.setDtcpApproved(
	                    colMap.containsKey("dtcp_approved")
	                            ? getBooleanCell(getCell(row, colMap, "dtcp_approved"))
	                            : false
	            );

	            plot.setReraApproved(
	                    colMap.containsKey("rera_approved")
	                            ? getBooleanCell(getCell(row, colMap, "rera_approved"))
	                            : false
	            );
	            plot.setBooked(getBooleanCell(row.getCell(colMap.get("booked"))));

	            // Layout mapping
	            String layoutName = getStringCell(row.getCell(colMap.get("layout_name")));
	            Layout layout = layoutRepo.findByLayoutName(layoutName)
	                    .orElseThrow(() -> new RuntimeException("Layout not found: " + layoutName));
	            plot.setLayout(layout);

	            plots.add(plot);
	        }

	        return plots;

	    } catch (Exception e) {
	        throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
	    }
	}


    private static Cell getCell(Row row, Map<String, Integer> colMap, String string) {
		// TODO Auto-generated method stub
		return null;
	}


	private static String getStringCell(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.STRING) return cell.getStringCellValue().trim();
        if (cell.getCellType() == CellType.NUMERIC) return String.valueOf((long) cell.getNumericCellValue());
        if (cell.getCellType() == CellType.BOOLEAN) return String.valueOf(cell.getBooleanCellValue());
        return "";
    }

    private static double getNumericCell(Cell cell) {
        if (cell == null) return 0;
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        if (cell.getCellType() == CellType.STRING) {
            try { return Double.parseDouble(cell.getStringCellValue().trim()); }
            catch (Exception e) { return 0; }
        }
        return 0;
    }

    private static boolean getBooleanCell(Cell cell) {
        if (cell == null) return false;
        if (cell.getCellType() == CellType.BOOLEAN) return cell.getBooleanCellValue();
        if (cell.getCellType() == CellType.STRING) {
            String v = cell.getStringCellValue().trim().toLowerCase();
            return v.equals("true") || v.equals("yes") || v.equals("1");
        }
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue() == 1;
        return false;
    }
}
