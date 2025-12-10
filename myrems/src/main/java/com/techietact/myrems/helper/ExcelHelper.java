package com.techietact.myrems.helper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
            Iterator<Row> rows = sheet.iterator();
            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();

                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Plot plot = new Plot();

                plot.setPlotNo(getStringCell(currentRow.getCell(0)));
                plot.setSqft((int) getNumericCell(currentRow.getCell(1)));
                plot.setDirection(getStringCell(currentRow.getCell(2)));

                plot.setBreadthOne(getNumericCell(currentRow.getCell(3)));
                plot.setBreadthTwo(getNumericCell(currentRow.getCell(4)));
                plot.setLengthOne(getNumericCell(currentRow.getCell(5)));
                plot.setLengthTwo(getNumericCell(currentRow.getCell(6)));

                plot.setPrice(getNumericCell(currentRow.getCell(7)));
                plot.setTotalSqft(getNumericCell(currentRow.getCell(8)));

                plot.setAddress(getStringCell(currentRow.getCell(9)));
                plot.setMobile((long) getNumericCell(currentRow.getCell(10)));
                plot.setOwnerName(getStringCell(currentRow.getCell(11)));
                plot.setEmail(getStringCell(currentRow.getCell(12)));

                plot.setBooked(getBooleanCell(currentRow.getCell(13)));

                String layoutName = getStringCell(currentRow.getCell(14));

                if (layoutName != null && !layoutName.isEmpty()) {
                    Layout layout = layoutRepo.getByLayoutName(layoutName)
                            .orElseThrow(() -> new RuntimeException("Layout not found: " + layoutName));
                    plot.setLayout(layout);
                }

                plots.add(plot);
            }

            return plots;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
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
