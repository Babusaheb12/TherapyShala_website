import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../../utils/constants.dart';
import '../../utils/flutter_color_themes.dart';
import '../../widget/buttonWigiets.dart';

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

  NotificationDetailsScreen({
    super.key,
    this.title = "Book Service",
    this.message =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    this.date = "Dec, 20 2024",
    this.time = "08.40 AM",
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.serviceDescription =
        "Immerse yourself in tranquility with our Relaxation Retreat Package.",
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
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false,
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: const SizedBox(
            width: 44,
            height: 44,
            child: Icon(Icons.arrow_back, color: Colors.black, size: 20),
          ),
        ),
        title: Text(
          Constants.notifications,
          style: FTextStyle.loginHeading(context),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 4),

                  // Date & Time
                  Text("$date  •  $time", style: FTextStyle.desc(context)),

                  SizedBox(height: 8),

                  // Notification Title
                  Text(
                    title,
                    style: FTextStyle.header(context)
                  ),
                  SizedBox(height: 4),
                  // Notification Description
                  Text(message, style: FTextStyle.desc(context)),
                  SizedBox(height: 8),
                  // Order Details Card
                  Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.white,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.03),
                          blurRadius: 10,
                          offset: Offset(0, 4),
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
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                imageUrl,
                                width: 70,
                                height: 70,
                                fit: BoxFit.cover,
                              ),
                            ),
                            SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    serviceTitle,
                                    style: FTextStyle.tittle(context),
                                    // maxLines: 3,
                                    // overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    serviceDescription,
                                    style: FTextStyle.desc(context),
                                    // maxLines: 2,
                                    // overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 20),
                        // Your Order Section
                        Text(
                          Constants.yourOrder,
                          style: FTextStyle.tittle(context),
                        ),
                        SizedBox(height: 4),
                        _buildDetailRow(context, "Package", packageName),
                        SizedBox(height: 4),
                        _buildDetailRow(context, "Beautician", beauticianName),
                        SizedBox(height: 4),
                        _buildDetailRow(context, "Dates", "Sun, 20 Dec 2024"),

                        SizedBox(height: 10),

                        // Price Details Section
                        Text(
                          Constants.priceDetails,
                          style: FTextStyle.tittle(context)
                        ),

                        SizedBox(height: 12),

                        _buildDetailRow(context, "Price", price),
                        SizedBox(height: 8),
                        _buildDetailRow(context, "Fee", fee),
                        SizedBox(height: 8),
                        _buildDetailRow(
                          context,
                          Constants.total,
                          totalPrice,
                          isTotal: true,
                        ),
                      ],
                    ),
                  ),

                  // SizedBox(height: 4),
                ],
              ),
            ),
          ),

          // Bottom Back Button

          Padding(
            padding:  EdgeInsets.fromLTRB(24, 4, 24, 90),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: CustomButton(
                text: Constants.back,
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ),
          ),
        ],
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
          style: FTextStyle.desc(context)
        ),
        Text(
          value,
          style: FTextStyle.tittle(context)
        ),
      ],
    );
  }
}
