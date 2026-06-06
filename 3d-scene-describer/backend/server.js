const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ""
});

const MOCK_DB = {
  "căn hộ": {
    tone: "bất động sản cao cấp",
    highlights: [
      "Thiết kế open-space tối ưu diện tích, tích hợp phòng khách – bếp – ăn liền mạch",
      "Hệ thống cửa kính full chiều cao đón sáng tự nhiên và tầm nhìn toàn thành phố",
      "Nội thất nhập khẩu cao cấp: sàn gỗ engineered, tủ bếp Acrylic, thiết bị Kohler",
      "Ban công rộng 8m² – không gian thư giãn riêng tư giữa lòng đô thị",
      "Hành lang thông minh tích hợp tủ giày, tủ lưu trữ âm tường tinh tế"
    ],
    notes: [
      "Quét riêng từng phòng trong khung giờ 9–11h sáng để ánh sáng tự nhiên đồng đều nhất",
      "Chú ý phản chiếu gương phòng tắm và kính bếp – cần khử nhiễu texture sau xử lý",
      "Đo đạc chính xác tỉ lệ trần – sàn để model 3D không bị méo phối cảnh",
      "Chụp bổ sung chi tiết vật liệu: vân gỗ, mặt đá, fabric sofa để tăng chân thực"
    ]
  },
  "biệt thự": {
    tone: "bất động sản hạng sang",
    highlights: [
      "Kiến trúc Địa Trung Hải thuần chất với mái ngói đỏ, cột đá tự nhiên và hồ bơi riêng 80m²",
      "Khu vườn 500m² được thiết kế bởi KTS cảnh quan quốc tế, hệ thống tưới tự động",
      "Nội thất do NTK nội thất TP.HCM thực hiện – mỗi không gian mang câu chuyện riêng",
      "Garage 3 xe, phòng gym, wine cellar và home theater tích hợp hoàn chỉnh",
      "Hệ thống smarthome Loxone điều khiển toàn bộ ánh sáng, rèm, điều hòa, bảo mật"
    ],
    notes: [
      "Lên kế hoạch quét nhiều ngày: mặt tiền & sân vườn buổi sáng, nội thất buổi chiều",
      "Khu vực hồ bơi cần thiết lập điểm quét đặc biệt – phản chiếu mặt nước gây nhiễu cao",
      "Ghi lại điểm tham chiếu mặt đất để ghép nối nội – ngoại thất chính xác",
      "Cần drone shot bên ngoài để hoàn chỉnh virtual tour toàn cảnh khuôn viên"
    ]
  },
  "văn phòng": {
    tone: "thương mại B2B",
    highlights: [
      "Không gian làm việc mở 500m² với 80 workstation linh hoạt theo mô hình hot-desking",
      "4 phòng họp kính soundproof tích hợp màn hình 75\", hệ thống đặt phòng tự động",
      "Khu lounge & pantry thiết kế như café – thúc đẩy sáng tạo và giao lưu nội bộ",
      "Hệ thống điều hòa VRF Daikin, chiếu sáng LED cảm biến chuyển động tiết kiệm năng lượng",
      "Tiêu chuẩn LEED Gold – môi trường làm việc lành mạnh, đạt chứng nhận xanh quốc tế"
    ],
    notes: [
      "Quét ngoài giờ hành chính để tránh người di chuyển làm nhiễu point cloud",
      "Đánh dấu vị trí thiết bị di động (bàn ghế di chuyển được) để xử lý layout chính xác",
      "Ghi chú hệ thống kỹ thuật nổi: ống gió, máng cáp – quan trọng cho BIM integration",
      "Chụp bổ sung biển hiệu, số phòng, bảng chỉ dẫn để hoàn thiện virtual wayfinding"
    ]
  },
  "cửa hàng": {
    tone: "bán lẻ",
    highlights: [
      "Mặt bằng 200m² bố cục zone traffic flow tối ưu – dẫn dắt khách từ cửa vào đến điểm thanh toán",
      "Hệ thống kệ trưng bày modular điều chỉnh chiều cao, phù hợp mọi nhóm sản phẩm",
      "Chiếu sáng track light 3000K làm nổi bật màu sắc và chất liệu sản phẩm",
      "Khu trải nghiệm thử – fitting room 4 cabin cách âm, ánh sáng đúng chuẩn màu da",
      "POS counter thiết kế thấp, mở – tạo cảm giác gần gũi, không rào cản với khách hàng"
    ],
    notes: [
      "Quét trước giờ mở cửa khi kệ hàng đã sắp xếp hoàn chỉnh và sạch sẽ nhất",
      "Cần quét đặc biệt khu vực kính trưng bày – dùng polarizing filter để khử phản chiếu",
      "Ghi chú vị trí camera an ninh, cảm biến cửa để tích hợp vào bản vẽ kỹ thuật",
      "Chụp thêm góc POV của khách hàng tại điểm vào và quầy thanh toán cho UX analysis"
    ]
  },
  "triển lãm": {
    tone: "triển lãm nghệ thuật & văn hóa",
    highlights: [
      "Không gian gallery 800m² với trần cao 6m – phù hợp tác phẩm điêu khắc quy mô lớn",
      "Hệ thống ánh sáng chuyên nghiệp: spotlight, floodlight điều chỉnh CRI 97 – tôn vinh màu sắc gốc",
      "Tường trắng tinh bằng chất liệu đặc biệt không phản sáng, sàn epoxy không gây chói",
      "Audio guide system tích hợp – khách tham quan kết nối qua QR code trực tiếp trong virtual tour",
      "Lối di chuyển rộng 3m giữa các zone – đảm bảo trải nghiệm thoải mái cho đoàn đông người"
    ],
    notes: [
      "Phối hợp với curator về lịch quét – tác phẩm phải được bố cục đúng vị trí trưng bày cuối",
      "Mỗi tác phẩm cần điểm quét riêng ở cự ly 1m để đạt độ phân giải chi tiết cao",
      "Xử lý riêng vật liệu có độ phản chiếu cao: kính khung tranh, bề mặt kim loại điêu khắc",
      "Ghi âm ambient sound của không gian để tích hợp vào virtual tour immersive"
    ]
  },
  "khách sạn": {
    tone: "hospitality cao cấp",
    highlights: [
      "Lobby ấn tượng cao 12m với installation nghệ thuật custom, sảnh đón tiếp 5 sao",
      "120 phòng nghỉ 4 tiêu chuẩn (Deluxe – Suite) – mỗi loại có virtual tour riêng biệt",
      "Nhà hàng & bar rooftop view 360° – điểm check-in social media không thể bỏ qua",
      "Spa & wellness 3 tầng: indoor pool, sauna, treatment room tích hợp trong không gian yên tĩnh",
      "MICE facilities: 5 phòng hội thảo từ 20–300 khách, sảnh tiệc grand ballroom 800m²"
    ],
    notes: [
      "Lên lịch quét từng khu vực theo ca hoạt động – lobby ban ngày, nhà hàng sau 14h",
      "Phòng nghỉ cần chụp 1 mẫu hoàn chỉnh của mỗi loại phòng với setup chuẩn",
      "Hành lang dài cần nhiều điểm quét chồng lấn để tránh distortion perspective",
      "Tích hợp thông tin tiện ích (minibar, TV, điều hòa) vào hotspot trong virtual tour"
    ]
  }
};

async function generateSceneDescription(projectName, spaceType, description, targetAudience) {
  const systemPrompt = `Bạn là chuyên gia về không gian 3D và marketing bất động sản.
Nhiệm vụ: Tạo nội dung tiếp thị chuyên nghiệp và hướng dẫn số hóa 3D cho các dự án.

Yêu cầu output (JSON):
{
  "title": "Tiêu đề hấp dẫn (không vượt 80 ký tự)",
  "shortDescription": "Đoạn mô tả ngắn (2-3 câu, phù hợp nhóm khách hàng)",
  "highlights": ["5 điểm nổi bật của không gian"],
  "digitizationNotes": ["5 gợi ý kỹ thuật khi chụp/số hóa 3D loại không gian này"]
}

Chú ý:
- Tone phù hợp loại không gian và nhóm khách hàng
- Highlights phải cụ thể, không chung chung
- Digitization notes phải chuyên nghiệp, dựa vào đặc điểm riêng của loại không gian`;

  const userPrompt = `Tạo nội dung cho dự án 3D:
- Tên dự án: ${projectName}
- Loại không gian: ${spaceType}
- Mô tả: ${description}
- Nhóm khách hàng: ${targetAudience}

Trả về JSON hợp lệ.`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ]
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI response is not valid JSON");
    }

    const result = JSON.parse(jsonMatch[0]);
    return {
      title: result.title || projectName,
      shortDescription: result.shortDescription || "",
      highlights: Array.isArray(result.highlights) ? result.highlights : [],
      digitizationNotes: Array.isArray(result.digitizationNotes) ? result.digitizationNotes : [],
      tone: spaceType,
      generatedAt: new Date().toISOString(),
      model: "claude-3-5-sonnet"
    };
  } catch (error) {
    console.error("Claude API Error:", error.message);
    
    // Fallback to mock data nếu API fail
    const key = Object.keys(MOCK_DB).find(k => spaceType.toLowerCase().includes(k)) || "văn phòng";
    const data = MOCK_DB[key];
    const titleSuffixes = ["– Trải Nghiệm Số Hóa Đỉnh Cao", "– Không Gian Số 3D Toàn Diện", "| Virtual Tour Chuyên Nghiệp", "– Khám Phá Mọi Góc Độ"];
    const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

    return {
      title: `${projectName} ${suffix}`,
      shortDescription: `${projectName} được số hóa 3D hoàn toàn, mang đến trải nghiệm tham quan trực tuyến chân thực dành riêng cho ${targetAudience}. Với công nghệ quét laser độ chính xác cao, từng chi tiết không gian ${key} được tái hiện trung thực.`,
      highlights: data.highlights,
      digitizationNotes: data.notes,
      tone: data.tone,
      generatedAt: new Date().toISOString(),
      model: "mock-fallback"
    };
  }
}

function getMockData(projectName, spaceType, description, targetAudience) {
  const key = Object.keys(MOCK_DB).find(k => spaceType.toLowerCase().includes(k)) || "văn phòng";
  const data = MOCK_DB[key];
  const titleSuffixes = ["– Trải Nghiệm Số Hóa Đỉnh Cao", "– Không Gian Số 3D Toàn Diện", "| Virtual Tour Chuyên Nghiệp", "– Khám Phá Mọi Góc Độ"];
  const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];

  return {
    title: `${projectName} ${suffix}`,
    shortDescription: `${projectName} được số hóa 3D hoàn toàn, mang đến trải nghiệm tham quan trực tuyến chân thực dành riêng cho ${targetAudience}. Với công nghệ quét laser độ chính xác cao, từng chi tiết không gian ${key} được tái hiện trung thực – giúp khách hàng đưa ra quyết định nhanh chóng và tự tin hơn mà không cần đến tận nơi.`,
    highlights: data.highlights,
    digitizationNotes: data.notes,
    tone: data.tone,
    generatedAt: new Date().toISOString()
  };
}

app.post("/api/describe-scene", async (req, res) => {
  const { projectName, spaceType, description, targetAudience } = req.body;
  
  if (!projectName || !spaceType || !description || !targetAudience)
    return res.status(400).json({ error: "Vui lòng điền đầy đủ tất cả các trường." });
  if (projectName.trim().length < 2)
    return res.status(400).json({ error: "Tên dự án phải có ít nhất 2 ký tự." });
  if (description.trim().length < 10)
    return res.status(400).json({ error: "Mô tả phải có ít nhất 10 ký tự." });

  try {
    const result = await generateSceneDescription(projectName, spaceType, description, targetAudience);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error generating scene description:", error);
    res.status(500).json({ error: "Lỗi khi xử lý dữ liệu. Vui lòng thử lại." });
  }
});

app.get("/api/health", (_, res) => {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({ 
    status: "ok", 
    mode: hasApiKey ? "claude-ai" : "mock-fallback",
    apiConfigured: hasApiKey
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  const mode = process.env.ANTHROPIC_API_KEY ? "Claude API (LIVE)" : "Mock Mode (Fallback)";
  console.log(`Backend running on http://localhost:${PORT} [${mode}]`);
});