import React, { useState } from 'react'
import PricingComponent from './section/Pricing';
export default function Index() {
    const [pricingPlans] = useState<any[]>([

        {
            id: "a3fbbb39-db48-48df-a89b-2eb82a534026",
            title: "FREE",
            description: "",
            currency: "VND",
            price: "2.100.000",
            featured: false,
            features: [
                "Tư vấn quy trình và thu tục đăng ký",
                "Tra cứu sơ bộ (tối đa 5 nhãn)",
                "Tư vấn sửa đổi nhãn hiệu sau tra cứu",
                "Soạn thảo, nộp hồ sơ đăng ký nhãn hiệu",
                "Theo dõi hồ sơ sau đăng ký",
                "Tư vấn đặt tên thương hiệu (tối đa 3 thương hiệu)"
            ]
        },
        {
            id: "a3fbbb39-db48-48df-a89b-2eb82a534027",
            title: "PRO",
            description: "",
            currency: "VND",
            price: "2.100.000",
            featured: true,
            features: [
                "Tư vấn quy trình và thu tục đăng ký",
                "Tra cứu sơ bộ (tối đa 5 nhãn)",
                "Tư vấn sửa đổi nhãn hiệu sau tra cứu",
                "Soạn thảo, nộp hồ sơ đăng ký nhãn hiệu",
                "Theo dõi hồ sơ sau đăng ký",
                "Tư vấn đặt tên thương hiệu (tối đa 3 thương hiệu)"
            ]
        },
        {
            id: "a3fbbb39-db48-48df-a89b-2eb82a534028",
            title: "PREMIUM",
            description: "",
            currency: "VND",
            price: "2.100.000",
            featured: false,
            features: [
                "Tư vấn quy trình và thu tục đăng ký",
                "Tra cứu sơ bộ (tối đa 5 nhãn)",
                "Tư vấn sửa đổi nhãn hiệu sau tra cứu",
                "Soạn thảo, nộp hồ sơ đăng ký nhãn hiệu",
                "Theo dõi hồ sơ sau đăng ký",
                "Tư vấn đặt tên thương hiệu (tối đa 3 thương hiệu)"
            ]
        }
    ]);
    return (
        <>
            <PricingComponent
                title="ĐĂNG KÝ TÀI KHOẢN PREMIUM TẠI ONLINE TEST"
                plans={pricingPlans}
                variant="feature"
                backgroundColor="bg-gradient-to-br from-blue-50 to-indigo-100" />
        </>
    )
}
