import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class EReceiptScreen extends StatelessWidget {
  final String serviceTitle;
  final String address;
  final String name;
  final String phone;
  final String bookingDate;
  final String bookingHours;
  final String beautician;
  final String package;
  final String totalPrice;

   EReceiptScreen({
    super.key,
    this.serviceTitle = "Euphoria & Spa Beauty",
    this.address = "123 Main Street, Anytown, USA",
    this.name = "Amelia Wilson",
    this.phone = "+1 (409) 587-1935",
    this.bookingDate = "December 28, 2024",
    this.bookingHours = "11.00 AM",
    this.beautician = "Aria Harris",
    this.package = "Basic",
    this.totalPrice = "₹1,500.00",
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child:  Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
        title: Text(
          "eReceipt",
          style: FTextStyle.header(context)
        ),
        centerTitle: true,

      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding:  EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Container(
                  width: double.infinity,
                  padding:  EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color:  AppColors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 16,
                        offset:  Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Top Green Success Badge
                      Container(
                        width: 54,
                        height: 54,
                        decoration:  BoxDecoration(
                          color: Color(0xFFD1F5EA),
                          shape: BoxShape.circle,
                        ),
                        child:  Icon(
                          Icons.check_circle_rounded,
                          color: Color(0xFF38C9A6),
                          size: 32,
                        ),
                      ),

                       SizedBox(height: 12),

                      Text(
                        "Booking Success!",
                        style: FTextStyle.header(context)
                      ),

                       SizedBox(height: 10),

                      // Dashed Divider
                      Row(
                        children: List.generate(
                          30,
                          (index) => Expanded(
                            child: Container(
                              height: 1.5,
                              color: index % 2 == 0
                                  ?  Color(0xFFE0E1E6)
                                  : Colors.transparent,
                            ),
                          ),
                        ),
                      ),

                       SizedBox(height: 24),

                      // Receipt Details Key-Value List
                      _buildReceiptRow(context, "Clinic", serviceTitle),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Address", address, isMultiLine: true),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Name", name),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Phone", phone),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Booking Date", bookingDate),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Booking Hours", bookingHours),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Specialist", beautician),
                       SizedBox(height: 14),
                      _buildReceiptRow(context, "Package", package),

                       SizedBox(height: 20),
                       Divider(color: Color(0xFFEBEBEB), thickness: 1),
                       SizedBox(height: 16),

                      _buildReceiptRow(
                        context,
                        "Total",
                        totalPrice,
                        isBold: true,
                        valueColor: AppColors.textPrimary,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Fixed Action Button
            Padding(
              padding:  EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: "Download PDF",
                onPressed: () {
                  CustomSnackBar.show(
                    context,
                    message: "Downloading eReceipt PDF...",
                    icon: Icons.picture_as_pdf_rounded,
                  );
                },
                height: 52,
                borderRadius: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReceiptRow(
    BuildContext context,
    String label,
    String value, {
    bool isBold = false,
    bool isMultiLine = false,
    Color? valueColor,
  }) {
    return Row(
      crossAxisAlignment:
          isMultiLine ? CrossAxisAlignment.start : CrossAxisAlignment.center,
      children: [
        Text(
          label,
          style: FTextStyle.desc(context)
        ),
         SizedBox(width: 16),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: FTextStyle.tittle(context)
          ),
        ),
      ],
    );
  }
}
