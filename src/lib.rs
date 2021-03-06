use marching_squares::{Field, Point};
use normal_map::f64::*;
use opensimplex_noise_rs::OpenSimplexNoise;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_iso_lines() -> String {
    let linear_map = LinearMap::new(-1.0, 1.0, Unit::Generic);
    let noise_generator = OpenSimplexNoise::new(Some(1));
    let scale = 0.5;

    let width = 100_usize;
    let height = 100_usize;
    let n_steps = 10_usize;

    let data = (0..height)
        .map(|y| {
            (0..width)
                .map(|x| {
                    let value = noise_generator.eval_2d(x as f64 * scale, y as f64 * scale);
                    let normal_value = linear_map.normalize(value);
                    normal_value as i16
                })
                .collect::<Vec<i16>>()
        })
        .collect::<Vec<Vec<i16>>>();

    let field = Field {
        dimensions: (width, height),
        top_left: Point { x: 0.0, y: 0.0 },
        pixel_size: (1.0, 1.0),
        values: &data,
    };

    // serde_json::to_string(&data).unwrap()

    let mut contours = Vec::new();

    for step in 0..n_steps {
        let contour = field
            .get_contours(step as i16)
            .iter()
            .map(|line| {
                line.clone()
                    .points
                    .into_iter()
                    .map(|point| [point.x, point.y])
                    .collect::<Vec<[f32; 2]>>()
            })
            .collect::<Vec<Vec<[f32; 2]>>>();

        contours.push(contour);
    }

    serde_json::to_string(&contours).unwrap()
}
