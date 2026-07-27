import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/flutter_color_themes.dart';

class NotificationDetailsScreen extends StatelessWidget {
  final String title;
  final String message;
  final String date;
  final String time;
  final String serviceTitle;
  final String serviceDescription;
  final String packageName;
  final String beauticianName;
  final String price;
  final String fee;
  final String totalPrice;
  final String imageUrl;

  const NotificationDetailsScreen({
    super.key,
    this.title = "Book Service",
    this.message =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    this.date = "Dec, 20 2024",
    this.time = "08.40 AM",
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.serviceDescription =
        "Immerse yourself in tranquility with our Relaxation Retreat Package. Enjoy a s...",
    this.packageName = "Basic",
    this.beauticianName = "Aria Harris",
    this.price = "₹1,500.00",
    this.fee = "₹27.00",
    this.totalPrice = "₹1,527.00",
    this.imageUrl =
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300",
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),

                    //================== App Bar ==================
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pop(context);
                            },
                            child: Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: const Color(0xffEAEAEA),
                                ),
                              ),
                              child: const Icon(
                                Icons.arrow_back,
                                color: Colors.black,
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                        Text(
                          "Notifications",
                          style: FTextStyle.loginHeading(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Date & Time
                    Text(
                      "$date  •  $time",
                      style: FTextStyle.desc(context).copyWith(
                        color: const Color(0xFF9EA3B0),
                        fontSize: 13,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Notification Title
                    Text(
                      title,
                      style: FTextStyle.header(context).copyWith(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Notification Description
                    Text(
                      message,
                      style: FTextStyle.desc(context).copyWith(
                        color: const Color(0xFF757880),
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Order Details Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFFEBEBEB),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Service Info Header
                          Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: Image.network(
                                  imageUrl,
                                  width: 70,
                                  height: 70,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      serviceTitle,
                                      style: FTextStyle.tittle(context).copyWith(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      serviceDescription,
                                      style: FTextStyle.desc(context).copyWith(
                                        fontSize: 12,
                                        color: const Color(0xFF757880),
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          // Your Order Section
                          Text(
                            "Your Order",
                            style: FTextStyle.tittle(context).copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),

                          const SizedBox(height: 12),

                          _buildDetailRow(context, "Package", packageName),
                          const SizedBox(height: 8),
                          _buildDetailRow(context, "Beautician", beauticianName),
                          const SizedBox(height: 8),
                          _buildDetailRow(context, "Dates", "Sun, 20 Dec 2024"),

                          const SizedBox(height: 20),

                          // Price Details Section
                          Text(
                            "Price Details",
                            style: FTextStyle.tittle(context).copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),

                          const SizedBox(height: 12),

                          _buildDetailRow(context, "Price", price),
                          const SizedBox(height: 8),
                          _buildDetailRow(context, "Fee", fee),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            context,
                            "Total Price",
                            totalPrice,
                            isTotal: true,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Bottom Back Button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    "Back",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    BuildContext context,
    String label,
    String value, {
    bool isTotal = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: FTextStyle.desc(context).copyWith(
            color: isTotal ? AppColors.black : const Color(0xFF9EA3B0),
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w400,
            fontSize: 13,
          ),
        ),
        Text(
          value,
          style: FTextStyle.tittle(context).copyWith(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w600,
            fontSize: isTotal ? 15 : 13,
            color: AppColors.black,
          ),
        ),
      ],
    );
  }
}
