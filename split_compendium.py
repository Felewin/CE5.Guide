import os
import math

def split_file(input_filename, target_size_bytes):
    # Read the input file
    with open(input_filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get total size and calculate number of needed chunks
    total_size = len(content.encode('utf-8'))
    num_chunks = math.ceil(total_size / target_size_bytes)
    
    # Calculate chunk size (in characters)
    chunk_size = math.ceil(len(content) / num_chunks)
    
    # Create output directory if it doesn't exist
    output_dir = 'split_files'
    os.makedirs(output_dir, exist_ok=True)
    
    # Split and write chunks
    for i in range(num_chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, len(content))
        chunk_content = content[start_idx:end_idx]
        
        # Create output filename
        base_name = os.path.splitext(os.path.basename(input_filename))[0]
        output_filename = f'{base_name}_part_{i+1}.txt'
        output_path = os.path.join(output_dir, output_filename)
        
        # Write chunk to file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(chunk_content)
        
        print(f'Created {output_filename}')

def main():
    # Input file path
    input_file = 'B9gQNp9h - ✨-contact-compendium-💖.txt'
    
    # Target size slightly smaller than the intuition file
    target_size = 3_000_000  # bytes (adjust this based on actual intuition file size)
    
    try:
        split_file(input_file, target_size)
        print("File splitting completed successfully!")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()