import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import '../widget/buttonWigiets.dart';
import '../widget/custom_bottom_navbar.dart';

class SpecializationCategory {
  final String id;
  final String title;
  final String emoji;
  final List<String> services;

  SpecializationCategory({
    required this.id,
    required this.title,
    required this.emoji,
    required this.services,
  });
}

class TherapistSpecializationScreen extends StatefulWidget {
  TherapistSpecializationScreen({super.key});

  @override
  State<TherapistSpecializationScreen> createState() =>
      _TherapistSpecializationScreenState();
}

class _TherapistSpecializationScreenState
    extends State<TherapistSpecializationScreen> {
  final List<SpecializationCategory> _categories = [
    SpecializationCategory(
      id: 'massage',
      title: 'Massage Therapist',
      emoji: '💆',
      services: [
        'Swedish Massage',
        'Deep Tissue Massage',
        'Thai Massage',
        'Balinese Massage',
        'Aromatherapy Massage',
        'Hot Stone Massage',
        'Sports Massage',
        'Head, Neck & Shoulder Massage',
        'Foot Reflexology',
      ],
    ),
    SpecializationCategory(
      id: 'beauty',
      title: 'Beauty Therapist',
      emoji: '💄',
      services: [
        'Facial',
        'Cleanup',
        'Bleach',
        'Detan',
        'Threading',
        'Waxing',
        'Eyebrow & Upper Lip',
        'Skin Treatment',
      ],
    ),
    SpecializationCategory(
      id: 'hair',
      title: 'Hair Stylist',
      emoji: '💇',
      services: [
        'Hair Cut',
        'Hair Spa',
        'Hair Color',
        'Hair Smoothening',
        'Hair Straightening',
        'Keratin Treatment',
        'Hair Wash & Blow Dry',
      ],
    ),
    SpecializationCategory(
      id: 'makeup',
      title: 'Makeup Artist',
      emoji: '💋',
      services: [
        'Party Makeup',
        'Bridal Makeup',
        'Engagement Makeup',
        'HD Makeup',
        'Airbrush Makeup',
      ],
    ),
    SpecializationCategory(
      id: 'nail',
      title: 'Nail Technician',
      emoji: '💅',
      services: [
        'Manicure',
        'Pedicure',
        'Gel Nails',
        'Nail Extensions',
        'Nail Art',
      ],
    ),
    SpecializationCategory(
      id: 'spa',
      title: 'Spa Therapist',
      emoji: '🌿',
      services: [
        'Body Spa',
        'Body Polish',
        'Body Scrub',
        'Body Wrap',
      ],
    ),
    SpecializationCategory(
      id: 'wellness',
      title: 'Wellness Therapist',
      emoji: '🧘',
      services: [
        'Yoga Instructor',
        'Meditation Coach',
        'Prenatal Massage',
        'Postnatal Massage',
      ],
    ),
  ];

  final Set<String> _selectedCategories = {'massage', 'beauty'};
  final Set<String> _selectedServices = {
    'Swedish Massage',
    'Deep Tissue Massage',
    'Aromatherapy Massage',
    'Thai Massage',
    'Facial',
    'Cleanup',
  };

  void _toggleCategory(String id) {
    setState(() {
      if (_selectedCategories.contains(id)) {
        _selectedCategories.remove(id);
      } else {
        _selectedCategories.add(id);
      }
    });
  }

  void _toggleService(String service) {
    setState(() {
      if (_selectedServices.contains(service)) {
        _selectedServices.remove(service);
      } else {
        _selectedServices.add(service);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFAFAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppColors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Therapist Registration',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select Specialization',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 6),
              Text(
                'Choose your specializations and the specific services you provide.',
                style: FTextStyle.loginDesc(context),
              ),
              SizedBox(height: 20),

              // Categories Selector Chips
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: _categories.map((category) {
                  final isSelected = _selectedCategories.contains(category.id);
                  return FilterChip(
                    selected: isSelected,
                    showCheckmark: true,
                    label: Text('${category.emoji} ${category.title}'),
                    labelStyle: TextStyle(
                      fontSize: 14,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.w400,
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                    selectedColor: AppColors.primary,
                    backgroundColor: Colors.white,
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : Color(0xFFE5E7EB),
                      width: 1.2,
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    onSelected: (_) => _toggleCategory(category.id),
                  );
                }).toList(),
              ),

              SizedBox(height: 28),
              Divider(color: Color(0xFFE5E7EB)),
              SizedBox(height: 16),

              Text(
                'Select Offered Services',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 14),

              // Sub-services list for selected specializations
              ..._categories
                  .where((cat) => _selectedCategories.contains(cat.id))
                  .map((cat) {
                return Container(
                  margin: EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Color(0xFFE5E7EB)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ExpansionTile(
                    initiallyExpanded: true,
                    shape: Border(),
                    leading: Text(
                      cat.emoji,
                      style: TextStyle(fontSize: 24),
                    ),
                    title: Text(
                      cat.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    subtitle: Text(
                      '${cat.services.where((s) => _selectedServices.contains(s)).length} of ${cat.services.length} selected',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    children: [
                      Padding(
                        padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: cat.services.map((service) {
                            final isServiceSelected =
                                _selectedServices.contains(service);
                            return InkWell(
                              onTap: () => _toggleService(service),
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isServiceSelected
                                      ? AppColors.primaryLight
                                      : Color(0xFFF9FAFB),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isServiceSelected
                                        ? AppColors.primary
                                        : Color(0xFFE5E7EB),
                                    width: 1.2,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      isServiceSelected
                                          ? Icons.check_box_rounded
                                          : Icons
                                              .check_box_outline_blank_rounded,
                                      size: 18,
                                      color: isServiceSelected
                                          ? AppColors.primary
                                          : AppColors.textSecondary,
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      service,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: isServiceSelected
                                            ? FontWeight.w600
                                            : FontWeight.w400,
                                        color: isServiceSelected
                                            ? AppColors.primary
                                            : AppColors.textPrimary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                );
              }),

              if (_selectedCategories.isEmpty)
                Container(
                  padding: EdgeInsets.all(20),
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Color(0xFFE5E7EB)),
                  ),
                  child: Center(
                    child: Text(
                      'Please select at least one specialization category above.',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),

              SizedBox(height: 24),
              CustomButton(
                text: 'Save & Continue',
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MainScreenWithBottomNav(),
                    ),
                    (route) => false,
                  );
                },
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
